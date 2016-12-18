import { createModule } from 'redux-modules';
import { loop, liftState, Effects as Ef } from 'redux-loop';

import solid from 'solid-client';
const ns = solid.vocab;

const DEFAULT_CONTAINER = 'Posts';
const options = {
  name: 'Markdown Blog',
  shortdesc: 'A Solid backed markdown blog',
  redirectTemplateUri: 'https://localhost:3000',
};
const typesForApp = [ ns.sioc('MarkdownBlog'), ns.dct('MarkdownBlog') ];
const isListed = true;

const module = createModule({
  name: 'markdownBlog',
  initialState: {
    collection: '',
    webId: '',
    profile: {},
    errors: [],
    status: '',
  },
  selector: state => state.markdownBlog,
  composes: [liftState],
  transformations: {
    login: (state, { payload: webId }) => loop(
      { ...state, webId, status: 'Logging in' },
      Ef.promise(
        () => solid.login(webId)
          .then(solid.getProfile)
          .then(profile => profile.loadAppRegistry())
          .then(module.actions.registerApplication)
          .catch(module.actions.networkError)
      )
    ),
    registerApplication: (state, { payload: profile }) => loop(
      { ...state, profile, status: 'Checking app registration' },
      Ef.promise(
        () => {
          const registrationResults = profile.appsForType(ns.sioc('MarkdownBlog'));
          const isRegistered = !!registrationResults.length;
          if (isRegistered) {
            return module.actions.checkContainerExistence();
          } else {
            const app = new solid.AppRegistration(options, typesForApp, isListed);
            return profile
              .registerApp(app)
              .then(module.actions.checkContainerExistence);
          }
        }
      )
    ),
    checkContainerExistence: state => loop(
      { ...state, status: 'Checking container existence' },
      Ef.promise(
        () => solid.web.get(`${state.webId}/${DEFAULT_CONTAINER}/`)
          .then(module.actions.loginSuccess)
          .catch(module.actions.createContainer)
      )
    ),
    createContainer: state => loop(
      { ...state, status: 'Creating container' },
      Ef.promise(
        () => solid.web.createContainer(state.webId, DEFAULT_CONTAINER)
          .then(module.actions.loginSuccess)
          .catch(module.actions.networkError)
      )
    ),
    loginSuccess: state => ({ ...state, status: '' }),
  },
});

export default module;
