import { createModule } from 'redux-modules';
import { loop, liftState, Effects as Ef } from 'redux-loop';
import postModule from '../Posts/module';

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
    profile: null,
    errors: [],
    status: '',
    posts: {
      collection: {},
      container: '',
      webId: '',
    },
  },
  selector: state => state.markdownBlog,
  composes: [liftState],
  transformations: {
    setWebId: (state, { payload: webId }) =>
      ({ ...state, webId }),
    login: state => loop(
      { ...state, status: 'Logging in' },
      Ef.promise(
        () => solid.login(`https://${state.webId}`)
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
    signup: state => loop(
      { ...state, status: 'Signing up' },
      Ef.promise(
        () => solid.signup().then(module.actions.setWebId)
      )
    ),

    loginSuccess: state => ({ ...state, status: '' }),
    updatePosts: (state, { payload }) => {
      const [nState, effects] = postModule(state.posts, payload);
      return loop(
        { ...state, posts: nState },
        Ef.lift(effects, module.actions.updatePosts)
      );
    },
  },
});

export default module;
