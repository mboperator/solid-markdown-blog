import React, {PropTypes} from 'react';

export default class CreatePost extends React.Component {
  createPost = () => {
    const title = this.titleInput.value;
    const content = this.contentInput.value;

    console.log('Creating', title, content);
  }

  render() {
    return (
      <div>
        <input ref={elem => this.titleInput = elem} placeholder="Title" />
        <input ref={elem => this.contentInput = elem} placeholder="Content" />
      </div>
    );
  }
}

CreatePost.propTypes = {
};
