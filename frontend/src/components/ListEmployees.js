import React from 'react';
import ReactDOM from 'react-dom';
import { Progress } from 'reactstrap';
import ReactTable from 'react-table';

import 'react-table/react-table.css';
import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';

class ListEmployees extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeList: [],
    };

    this.handleEmployeeListGetBrief = this.handleEmployeeListGetBrief.bind(
      this
    );
  }

  handleEmployeeListGetBrief(employeeList) {
    this.setState({
      employeeList: employeeList,
    });
  }

  componentDidMount() {
    let response = [
      {
        id: 1,
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: 'Иванович',
        hrName: 'Бежецкова Е.',
        employmentDate: '2017-07-10',
        currentWorkflowStep: 'WELCOME_MEETING',
        workflow: [
          {
            id: 8,
            type: 'ADD',
            status: 'COMPLETE',
            overdue: false,
          },
          {
            id: 7,
            type: 'TASK_LIST',
            status: 'COMPLETE',
            overdue: false,
          },
          {
            id: 6,
            type: 'WELCOME_MEETING',
            status: 'IN_PROGRESS',
            overdue: false,
          },
          {
            id: 5,
            type: 'INTERIM_MEETING',
            status: 'NOT_DONE',
            overdue: true,
          },
          {
            id: 4,
            type: 'INTERIM_MEETING_RESULT',
            status: 'NOT_DONE',
            overdue: false,
          },
          {
            id: 3,
            type: 'FINAL_MEETING',
            status: 'NOT_DONE',
            overdue: false,
          },
          {
            id: 2,
            type: 'FINAL_MEETING_RESULT',
            status: 'NOT_DONE',
            overdue: false,
          },
          {
            id: 1,
            type: 'QUESTIONNAIRE',
            status: 'NOT_DONE',
            overdue: false,
          },
        ],
      },
      {
        id: 2,
        firstName: 'Ольга',
        lastName: 'Петрова',
        middleName: 'Андреевна',
        hrName: 'Бежецкова Е.',
        employmentDate: '2017-11-10',
        currentWorkflowStep: 'ADD',
        workflow: [
          {
            id: 16,
            type: 'ADD',
            status: 'COMPLETE',
            overdue: false,
          },
          {
            id: 15,
            type: 'TASK_LIST',
            status: 'NOT_DONE',
            overdue: false,
          },
          {
            id: 14,
            type: 'WELCOME_MEETING',
            status: 'NOT_DONE',
            overdue: false,
          },
          {
            id: 13,
            type: 'INTERIM_MEETING',
            status: 'NOT_DONE',
            overdue: false,
          },
          {
            id: 12,
            type: 'INTERIM_MEETING_RESULT',
            status: 'NOT_DONE',
            overdue: false,
          },
          {
            id: 11,
            type: 'FINAL_MEETING',
            status: 'NOT_DONE',
            overdue: false,
          },
          {
            id: 10,
            type: 'FINAL_MEETING_RESULT',
            status: 'NOT_DONE',
            overdue: false,
          },
          {
            id: 9,
            type: 'QUESTIONNAIRE',
            status: 'NOT_DONE',
            overdue: false,
          },
        ],
      },
    ];

    let url = '/api/employee/all/brief/';
    //axios.get(url)
    //  .then(function (response) {
    //      console.log(response);
    this.handleEmployeeListGetBrief(response);
    //  })
    //  .catch(function (error) {
    //    console.log(error);
    //  });
  }

  prepareProgressBar(colorsMap, shortTextToDisplay) {
    for (let i = 0; i < employeeList.length; i++) {
      employeeList[i]['workflowToBeShown'] = [];
      for (let j = 0; j < employeeList[i].workflow.length; j++) {
        employeeList[i]['workflowToBeShown'].push({
          color:
            colorsMap[employeeList[i].workflow[j]['overdue']][
              employeeList[i].workflow[j]['status']
            ],
          key: i + ' ' + j,
          value: 100.0 / employeeList[i].workflow.length,
          textToDisplay:
            shortTextToDisplay[employeeList[i].workflow[j]['type']],
        });
      }
    }
  }

  render() {
    let colorsMap = {
      true: {
        IN_PROGRESS: 'danger',
        COMPLETE: 'danger',
        NOT_DONE: 'danger',
      },
      false: {
        IN_PROGRESS: 'warning',
        COMPLETE: 'success',
        NOT_DONE: 'light',
      },
    };

    let shortTextToDisplay = {
      ADD: 1,
      TASK_LIST: 2,
      WELCOME_MEETING: 3,
      INTERIM_MEETING: 4,
      INTERIM_MEETING_RESULT: 5,
      FINAL_MEETING: 6,
      FINAL_MEETING_RESULT: 7,
      QUESTIONNAIRE: 8,
    };

    let columns = [
      {
        Header: 'ФИО',
        id: 'fullName',
        accessor: (row) =>
          row.firstName + ' ' + row.middleName + ' ' + row.lastName,
      },
      {
        Header: 'Дата выхода',
        accessor: 'employmentDate',
      },
      {
        Header: 'Состояние',
        accessor: 'progress',
        Cell: (row) => (
          <div>
            <div className="text-center">
              {row.original.currentWorkflowStep}
            </div>

            <Progress multi>
              {row.original.workflow.map((workflowStage) => (
                <Progress
                  bar
                  color={
                    colorsMap[workflowStage['overdue']][workflowStage['status']]
                  }
                  value={100.0 / row.original.workflow.length}
                >
                  {shortTextToDisplay[workflowStage['type']]}
                </Progress>
              ))}
            </Progress>
          </div>
        ),
      },
    ];

    return (
      <div>
        <ReactTable data={this.state.employeeList} columns={columns} />
      </div>
    );
  }
}

export default ListEmployees;
