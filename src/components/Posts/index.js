import React, {PropTypes} from 'react';
import solid from 'solid-client';

export default class Posts extends React.Component {
  state = {
    collection: [],
  }

  componentDidMount() {
    const { webId, container } = this.props;
    solid.web.get(`${webId}/${container}`)
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
  container: PropTypes.string,
};

Posts.defaultProps = {
  container: 'Posts',
};
