import Block from "core/Block";
import { createModalToggler } from "utils/dom";
import { MODAL_СHANGE_USER_AVATAR_ID } from "utils/const";
import Router from "core/router";
import { WithRouter, WithStore, WithUser } from "helpers";
import { Store } from "core";
import { signout } from "services/auth";
import { userDataArray } from "utils/userDataArray";

const toggleChangeAvatarModal = createModalToggler(MODAL_СHANGE_USER_AVATAR_ID);

type ProfilePageProps = {
  router: Router;
  store: Store<AppState>;
  user: UserType | null;
  userData: Array<any>;
};

class ProfilePage extends Block<ProfilePageProps> {
  static componentName = "ProfilePage";
  constructor(props: ProfilePageProps) {
    super({ ...props, toggleChangeAvatarModal });
    const data = props.user ? userDataArray(props.user) : [];
    console.log(data);

    this.setProps({
      ...this.props,
      userData: data,
    });
  }
  protected getStateFromProps(_props: ProfilePageProps) {
    this.state = {
      onChangeDataPage: () => {
        this.props.router.go("/changeDataProfile");
      },
      onChangePasswordPage: () => {
        this.props.router.go("/changePassProfile");
      },
      onMainPage: () => {
        this.props.store.dispatch(signout);
      },
    };
  }

  render() {
    // language=hbs
    return `
      {{#Layout name="Main" }}
        <div class="content profile">
          {{{ProfileNav}}}
          <div class="profile__main">
            {{{ProfileAvatar avatarPath = userData.userAvatar userName=userData.userName}}}
              <div class='profile__info'>
              {{#each userData}}
                {{#with this}}
                {{{ProfileItem
                  label=title
                  info=data
                }}}
                {{/with}}

              {{/each}}
              </div>
              {{{Button
                className="button__main"
                text="Change
                profile"
                onClick=onChangeDataPage
              }}}
              {{{Button
                className="button__main"
                text="Change
                password"
                onClick=onChangePasswordPage
              }}}
              {{{Button
                onClick=onMainPage
                className="button__main button__main_red"
                text="Exit"
              }}}
          </div>
           {{{Modal id="modal-change-avatar" toggler=toggleChangeAvatarModal  inputLabel="Choose file" inputId="user_avatar" title="Upload file" buttonText="Change" inputName="user_avatar"}}}
        </div>
      {{/Layout}}
    `;
  }
}
export default WithRouter(WithStore(WithUser(ProfilePage)));
