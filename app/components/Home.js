// @flow

import React, { Component, createRef } from 'react';
import googleTrends from 'google-trends-api';
import { Column, Table } from 'react-virtualized';
import 'react-select/dist/react-select.css';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      data: null
    };

    this.input = createRef();
    this.city = createRef();
  }

  onSubmit = () => {
    googleTrends
      .interestByRegion({
        keyword: this.input.current.value,
        startTime: new Date('2017-02-01'),
        endTime: new Date('2017-02-06'),
        resolution: 'CITY'
      })
      .then(res => {
        this.setState({ data: JSON.parse(res) });
        return res;
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { data } = this.state;

    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>App</h2>
          <input ref={this.input} className={styles.input} type="text" />
          <select ref={this.city}>
            <option value="US-CA-800">Bakersfield</option>
          </select>
          <button onClick={this.onSubmit} className={styles.button}>
            Search
          </button>

          <div>
            {data &&
              data.default.geoMapData && (
                <Table
                  width={1100}
                  height={700}
                  headerHeight={50}
                  rowHeight={50}
                  rowCount={data.default.geoMapData.length}
                  headerClassName={styles.tableHeaderItem}
                  rowGetter={({ index }) => data.default.geoMapData[index]}
                >
                  <Column
                    label="GeoName"
                    dataKey="geoName"
                    width={100}
                    className={styles.columnItem}
                  />
                  <Column
                    width={100}
                    label="MaxValueIndex"
                    dataKey="maxValueIndex"
                    className={styles.columnItem}
                  />
                </Table>
              )}
          </div>
        </div>
      </div>
    );
  }
}
