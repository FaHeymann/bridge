import React from 'react';
import axios from 'axios';
import Loader from 'react-loader-spinner'
import './OverdueTasks.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

class OverdueTasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: 'loading',
      tasks: [],
    };
  }

  async componentDidMount() {
    const response = await axios({
      method: 'get',
      url: 'https://bridge.fheymann.de/overdue-todos',
      headers: {
        Authorization: `Bearer ${this.props.apiToken}`,
      }
    });
    this.setState({
      loading: 'done',
      tasks: response.data.dueTodos,
    });
  }

  allTasksDone() {
    return this.state.loading === 'done' && this.state.tasks.length === 0;
  }

  getClassName() {
    return {
      fetching: 'OverdueTasks-Fetching',
      done: 'OverdueTasks-Done',
      notdone: 'OverdueTasks-Not-Done',
    }[this.state.today];
  }

  async closeTask(taskId) {
    await axios({
      method: 'post',
      url: 'https://bridge.fheymann.de/overdue-todos/close',
      headers: {
        Authorization: `Bearer ${this.props.apiToken}`,
      },
      data: {
        taskId,
      },
    });

    const newTasks = [...this.state.tasks];
    newTasks.splice(this.state.tasks.findIndex(e => e.id === taskId), 1);
    this.setState({
      loading: 'done',
      tasks: newTasks,
    });
  }

  renderTasks() {
    return (
      <ul className="OverdueTasks-List">
        {
          this.state.tasks.map(e => (
            <li
              key={e.id}
              className="OverdueTasks-List-Entry"
              onClick={() => {
                if (window.confirm(`Mark ${e.text} as done?`)) {
                  this.closeTask(e.id);
                }
              }}
            >
              <span role="img" aria-label="bullet">&#11093;</span> {e.text}
            </li>
          ))
        }
      </ul>
    )
  }

  render() {
    return (
      <div className="OverdueTasks">
        <div className={this.allTasksDone() ? "OverdueTasks-Body-Done" : "OverdueTasks-Body"}>
          <div className="OverdueTasks-Label">
            Overdue Tasks
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

export default OverdueTasks;
