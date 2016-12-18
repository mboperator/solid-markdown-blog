import React, {PropTypes} from 'react';
import solid from 'solid-client';
import rdf from 'rdflib';

const vocab = solid.vocab;

export default class Posts extends React.Component {
  state = {
    collection: [],
  }

  componentDidMount() {
    const { baseUrl, container } = this.props;
    solid.web.get(`${baseUrl}/${container}`)
      .then(container => {
        return Promise.all(
          container.contentsUris.map(uri => solid.web.get(uri))
        );
      })
      .then(posts => {
        return posts.map(post => {
          const graph = post.parsedGraph();
          const url = rdf.sym(post.url);
          const title = graph.any(url, vocab.dct('title'));
          const content = graph.any(url, vocab.sioc('content'));

          debugger;
          return {
            title: title.value,
            content: content.value,
          };
        });
      })
      .then(collection => {
        this.setState({ collection });
      })
  }

  render() {
    return (
      <div>
        {this.state.collection.map(post =>
          <div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
          </div>
        )}
      </div>
    );
  }
}

Posts.propTypes = {
  baseUrl: PropTypes.string,
  container: PropTypes.string,
};

Posts.defaultProps = {
  container: 'Posts',
};
