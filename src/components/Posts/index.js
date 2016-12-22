import React, {PropTypes} from 'react';
import { connectModule } from 'redux-modules';
import module from './module';

class Posts extends React.Component {
  render() {
    return (
      <div>
        {Object.keys(this.props.collection).map(key =>
          <div>
            <h1>{this.props.collection[key].title}</h1>
            <p>{this.props.collection[key].content}</p>
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

export default connectModule(module)(Posts);
