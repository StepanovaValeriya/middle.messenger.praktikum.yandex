import Block from "core/Block";
import Validate from "core/Validation";
import Router from "core/router";
import { WithRouter, WithStore, WithUser } from "helpers";
import { Store } from "core";
import { changeUserPassword } from "services/userData";

type ChangePassProfilePageProps = {
  router: Router;
  store: Store<AppState>;
  user: UserType | null;
};

class ChangePassProfilePage extends Block<ChangePassProfilePageProps> {
  static componentName = "ChangePassProfilePage";

  protected getStateFromProps() {
    this.state = {
      values: {
        passwordOld: "",
        password: "",
        passwordRepeat: "",
      },
      errors: {
        passwordOld: "",
        password: "",
        passwordRepeat: "",
      },

      handleErrors: (values: { [key: string]: number }, errors: { [key: string]: number }) => {
        const nextState = {
          errors,
          values,
        };
        this.setState(nextState);
      },
      onBlur: (e: FocusEvent) => {
        if (e.target) {
          const element = e.target as HTMLInputElement;
          const message = Validate(element.value, element.id);
          const newValues = { ...this.state.values };
          const newErrors = { ...this.state.errors };
          newValues[element.id] = element.value;
          if (message) {
            newErrors[element.id] = message;
          }
          this.state.handleErrors(newValues, newErrors);
        }
      },

      onInput: (e: Event) => {
        const element = e.target as HTMLInputElement;
        const message = Validate(element.value, element.id);
        if (element.id === "passwordOld") {
          this.refs.passwordOldRef.refs.errorRef.setProps({ text: message });
        }
        if (element.id === "password") {
          this.refs.passwordNewRef.refs.errorRef.setProps({ text: message });
        }
        if (element.id === "passwordRepeat") {
          this.refs.passwordRepeatRef.refs.errorRef.setProps({ text: message });
        }
      },
      formValid: () => {
        let isValid = true;
        const newValues = { ...this.state.values };
        const newErrors = { ...this.state.errors };
        Object.keys(this.state.values).forEach((key) => {
          const input = this.element?.querySelector(`input[name='${key}']`) as HTMLInputElement;
          newValues[key] = input.value;
          const message = Validate(newValues[key], key);
          if (message) {
            isValid = false;
            newErrors[key] = message;
          }
        });
        if (this.state.values.password !== this.state.values.passwordRepeat) {
          newErrors.passwordRepeat = "Passwords are not equal";
        }

        if (isValid) {
          this.state.handleErrors(newValues, newErrors);
          newErrors.passwordRepeat = "";
        }
        return isValid;
      },
      onSubmit: () => {
        if (this.state.formValid()) {
          const profileData = {
            oldPassword: this.state.values.passwordOld,
            newPassword: this.state.values.password,
          };
          changeUserPassword(this.props.store, { ...profileData });
        }
      },
    };
  }

  render() {
    const { errors, values } = this.state;
    const { isLoading } = this.props.store.getState();
    // language=hbs
    return `
    {{#if ${isLoading}}}
      {{{Loader}}}
    {{/if}}
      {{#Layout name="Main" }}
        <div class="content profile">
          {{{ProfileNav}}}
          <div class="profile__main">
              <div class='profile__info'>
              {{{ControlledInput
                className="input__profile"
                label="Old password"
                value="${values.passwordOld}"
                type="password"
                id="passwordOld"
                name="passwordOld"
                ref="passwordOldRef"
                onBlur=onBlur
                onFocus=onFocus
                onInput=onInput
              }}}
              {{{ControlledInput
                className="input__profile"
                label="New password"
                value="${values.password}"
                error="${errors.password}"
                type="password"
                id="password"
                ref="passwordNewRef"
                name="password"
                onBlur=onBlur
                onFocus=onFocus
                onInput=onInput
              }}}
              {{{ControlledInput
                className="input__profile"
                label="Repeat password"
                value="${values.passwordRepeat}"
                error="${errors.passwordRepeat}"
                type="password"
                id="passwordRepeat"
                ref="passwordRepeatRef"
                name="passwordRepeat"
                onBlur=onBlur
                onFocus=onFocus
                onInput=onInput
              }}}
              </div>
              {{{Button
                className="button__main"
                text="Save"
                onClick=onSubmit
              }}}
          </div>
        </div>
      {{/Layout}}
    `;
  }
}
export default WithStore(WithRouter(WithUser(ChangePassProfilePage)));
