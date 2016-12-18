import { createModule } from 'redux-modules';
import { loop, Effects as Ef, liftState } from 'redux-loop';
import solid from 'solid-client';

const module = createModule({
  name: 'Posts',
  initialState: {
    collection: {},
    container: '',
    webId: '',
  },
  composes: [liftState],
  transformations: {
    init: (state, { payload: { webId, container } }) => loop(
      { ...state, webId, container },
      Ef.promise(
        () => solid.web.get(`${webId}/${container}/`)
          .then(module.actions.initComplete)
          .catch(module.actions.createContainer)
      )
    ),

    createContainer: state => loop(
      state,
      Ef.promise(
        () => solid.web.createContainer(state.webId, state.container)
          .then(module.actions.initComplete)
          .catch(module.actions.initError)
      )
    ),

    initComplete: state => state,
  },
});

export default module;
