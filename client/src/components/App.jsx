import React from 'react';

import TableContainer from './Table';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      headings: [],
      data: []
    }
  }

  componentDidMount() {

    $.ajax({
      // Should set to a proper address if this were to be deployed
      url: 'http://localhost:3000/matches', 
      type: 'GET',
      success: (data) => {
        this.state.headings = data.headings;
        console.log('set state 1');
        console.log('this context: ', this);
        this.setState({data: data.rows});
        console.log('this state', this.state.data);
      },
      error: (err) => {
        console.log('No');
      }
    });

  }

  render() {
    console.log('app render called when state is: ', this.state.data);
    return (
      <div>
        <TableContainer headings={this.state.headings} data={this.state.data}/>
      </div>
    );
  }
}

export default App;