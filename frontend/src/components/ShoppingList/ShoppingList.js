import React from 'react';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import Modal from 'react-modal';
import './ShoppingList.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

Modal.setAppElement('#root');

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class ShoppingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: 'loading',
      tasks: [],
      modalIsOpen: false,
      inputValue: '',
    };

    this.updateInputValue = this.updateInputValue.bind(this);
  }

  async componentDidMount() {
    const response = await axios({
      method: 'get',
      url: 'https://bridge.fheymann.de/shopping-list',
      headers: {
        Authorization: `Bearer ${this.props.apiToken}`,
      }
    });
    this.setState({
      loading: 'done',
      tasks: response.data.items,
    });
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  updateInputValue(event) {
    this.setState({
      inputValue: event.target.value
    });
  }

  async submit() {
    const response = await axios({
      method: 'post',
      url: 'https://bridge.fheymann.de/shopping-list/new',
      headers: {
        Authorization: `Bearer ${this.props.apiToken}`,
      },
      data: {
        text: this.state.inputValue,
      },
    });

    const newTasks = this.state.tasks.concat({
      id: response.data.itemId,
      text: this.state.inputValue,
    });
    this.setState({
      inputValue: '',
      modalIsOpen: false,
      tasks: newTasks,
    });
  }

  renderTasks() {
    return (
      <ul className="ShoppingList-List">
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => this.closeModal()}
          style={modalStyles}
          contentLabel="Example Modal"
        >
          <h2>New Shopping Item</h2>
          <input type="text" placeholder="Shopping Item" value={this.state.inputValue} onChange={this.updateInputValue} />
          <button className="btn-submit" onClick={() => this.submit()}>Submit</button>
        </Modal>
        <li
          key="new"
          className="ShoppingList-List-Entry"
          onClick={() => this.openModal()}
        >
          <button><span role="img" aria-label="bullet">&#10133;</span> New Item</button>
        </li>
        {
          this.state.tasks.map(e => (
            <li
              key={e.id}
              className="ShoppingList-List-Entry"
            >
              <span role="img" aria-label="bullet">&#10095;</span> {e.text}
            </li>
          ))
        }
      </ul>
    )
  }

  render() {
    return (
      <div className="ShoppingList">
        <div className="ShoppingList-Body">
          <div className="ShoppingList-Label">
            Shopping List
          </div>
          {this.renderTasks()}
          <Loader
            visible={this.state.loading === 'loading'}
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
          />
        </div>
      </div >
    );
  }
}

export default ShoppingList;
