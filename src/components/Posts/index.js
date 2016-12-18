import React, {PropTypes} from 'react';
import solid from 'solid-client';

export default class Posts extends React.Component {
  state = {
    collection: [],
  }

  componentDidMount() {
    const { webId, folder } = this.props;
    solid.web.get(`${webId}/${folder}`)
      .then(response => {
        const graph = response.parsedGraph();
        debugger;
        // TODO: Implement the post reading logic
      })
  }

  render() {
    return (
      <div>
        Posts go here
      </div>
    );
  }
}

Posts.propTypes = {
  webId: PropTypes.string,
  folder: PropTypes.string,
};

Posts.defaultProps = {
  folder: 'Posts',
};
