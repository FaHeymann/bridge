import React from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Venting.css';

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

class Venting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      today: 'fetching',
      modalIsOpen: false,
    };
  }

  async componentDidMount() {
    const response = await axios({
      method: 'get',
      url: 'https://bridge.fheymann.de/venting',
      headers: {
        Authorization: `Bearer ${this.props.apiToken}`,
      }
    });

    this.setState({
      today: response.data.isDone ? 'done' : 'notdone',
    });
  }

  getClassName() {
    return {
      fetching: 'Venting-Today-Fetching',
      done: 'Venting-Today-Done',
      notdone: 'Venting-Today-Not-Done',
    }[this.state.today];
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  async submit() {
    await axios({
      method: 'post',
      url: 'https://bridge.fheymann.de/venting-done',
      headers: {
        Authorization: `Bearer ${this.props.apiToken}`,
      },
    });

    this.setState({
      today: 'done',
    });

    this.closeModal();
  }

  render() {
    return (
      <div className="Venting" onClick={() => this.openModal()}>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => this.closeModal()}
          style={modalStyles}
          contentLabel="Example Modal"
        >
          <h2>Venting Done</h2>
          <button className="btn-submit" onClick={() => this.submit()}>Venting Done</button>
        </Modal>
        <div className={this.getClassName()}>
          <div className="Venting-Label">
            Venting
          </div>
        </div>
      </div>
    );
  }
}

export default Venting;
