import Router from "core/router";
import { Store } from "core";
import { initRouter } from "services/initRouter";
import { defaultState } from "store";
import ErrorPage from "pages/errors/error";

describe("core/router", () => {
  let router: Router;
  let store: Store<AppState>;

  beforeEach(() => {
    store = new Store<AppState>(defaultState);
    window.store = store;
    router = new Router();
    window.router = router;
    initRouter(router, store);
  });

  it("Router should register routes", () => {
    const callback = () => {};
    router.use(
      { pathname: "/error", view: ErrorPage, isPrivate: false },
      callback
    );

    expect(router.routes).toContainEqual({
      pathname: "/error",
      view: ErrorPage,
      isPrivate: false,
      callback: callback,
    });
  });

  it("Router should change location.pathname", async () => {
    document.body.innerHTML = '<div id="app"></div>';
    const callback = () => {};

    router.use(
      { pathname: "/error", view: ErrorPage, isPrivate: false },
      callback
    );
    router.go("/error");

    expect(store.getState().currentPath).toBe("/error");
  });
});
