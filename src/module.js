import { createModule } from 'redux-modules';
import { loop, liftState, Effects as Ef } from 'redux-loop';

import solid from 'solid-client';
const ns = solid.vocab;

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
          .then(profile => {
            const registrationResults = profile.appsForType(ns.sioc('MarkdownBlog'));
            const isRegistered = !!registrationResults.length;
            if (isRegistered) {
              return module.actions.loginSuccess();
            } else {
              const app = new solid.AppRegistration(options, typesForApp, isListed);
              return profile
                .registerApp(app)
                .then(module.actions.loginSuccess);
            }
          })
          .catch(module.actions.networkError)
      )
    ),

    loginSuccess: state => ({ ...state, status: '' }),
  },
});

export default module;
