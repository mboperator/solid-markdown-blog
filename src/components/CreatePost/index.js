import React, {PropTypes} from 'react';
import solid from 'solid-client';
import rdf from 'rdflib';

const vocab = solid.vocab;

export default class CreatePost extends React.Component {
  createPost = () => {
    const title = this.titleInput.value;
    const content = this.contentInput.value;

    console.log('Creating', title, content);

    const graph = rdf.graph();
    const newPost = rdf.sym('');

    graph.add(newPost, vocab.dct('title'), rdf.lit(title));
    graph.add(newPost, vocab.sioc('content'), rdf.lit(content));

    const data = new rdf.Serializer(graph).toN3(graph);

    solid.web.post(`/${this.props.container}`, data)
      .then(meta => {
        debugger;
      });
  }

  render() {
    return (
      <div>
        <input ref={elem => this.titleInput = elem} placeholder="Title" />
        <input ref={elem => this.contentInput = elem} placeholder="Content" />
        <button onClick={this.createPost}>Publish</button>
      </div>
    );
  }
}

CreatePost.propTypes = {
};

CreatePost.defaultProps = {
  container: 'Posts',
};
