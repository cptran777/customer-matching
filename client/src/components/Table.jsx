import React from 'react';

/************** INDIVIDUAL TABLE ELEMENTS ******************/

const TableElement = (props) => {
  return (
      <td>{props.item}</td>
  );
};

const TableRow = (props) => {
  return (
    <tr>
      {props.data.map((item) => {
        return <TableElement item={item} key={Math.random() * 300000}/>
      })}
    </tr>
  );
};

/******************* TABLE CONTAINER ***********************/

// Table component expects a set number of headings, and for data an array of arrays, each item in the
// outer array representing a row in the table and each item in each row/inner array representing one datum
// Apparently the singular of data is datum.
class TableContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            {
              this.props.headings.map((title) => {
                return <th key={title}>{title}</th>
              })
            }
          </tr>
        </thead>
        <tbody>
          {this.props.data.map((datarow) => {
            return <TableRow data={datarow} key={Math.random() * 300000}/>
          })}
        </tbody>
      </table>
    );
  }
}

export default TableContainer;