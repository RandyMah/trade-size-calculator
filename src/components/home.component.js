import React, { Component } from "react";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountSize: 0,
      maxLoss: 0,
      entryPrice: 0,
      targetPrice: 0,
      stopLoss: 0,
      copySuccess: "",
      rewardToRisk: "",
      riskInDollars: "",
      profitAndLoss: "",
      leverage: "",
      contracts: "",
      units: "",
      tradeStatus: "",
      positionMode: "",
    };
  }

  handleChange(arrayKey, e) {
    this.setState({ [arrayKey]: Number.parseFloat(e.target.value) }, () => {
      this.doCalculations(this);
    });
  }

  copyToClipboard = (e) => {

    let code = `document.querySelectorAll('[value=${this.state.positionMode}]')[0].click();
              var nativeInputValueSetter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
              var inputEvent = new Event('input', { bubbles: true});
              var entryPrice = document.querySelectorAll('[name=price]')[0];
              entryPrice.dispatchEvent(new Event('focus', { bubbles: true}));
              nativeInputValueSetter.call(entryPrice, '${this.state.entryPrice}');
              entryPrice.dispatchEvent(inputEvent);
              var leverage = document.querySelector('[name=leverage]');
              nativeInputValueSetter.call(leverage, '${this.state.leverage}');
              leverage.dispatchEvent(inputEvent);
              var contractSize = document.querySelector('[name=sum]');
              nativeInputValueSetter.call(contractSize, '${this.state.contracts}');
              contractSize.dispatchEvent(inputEvent);
              var stopLossPrice = document.querySelectorAll('[name=price]')[1];
              nativeInputValueSetter.call(stopLossPrice, '${this.state.stopLoss}');
              stopLossPrice.dispatchEvent(inputEvent);
              var takeProfitPrice = document.querySelector('[name=orders\\\\.0\\\\.price]');
              nativeInputValueSetter.call(takeProfitPrice, '${this.state.targetPrice}');
              takeProfitPrice.dispatchEvent(inputEvent);
            `;

    this.textArea.value = code;
    this.textArea.select();
    this.textArea.setSelectionRange(0, 99999); /* For mobile devices */
    var result = document.execCommand("copy");
    this.setState({ copySuccess: result ? "Copied!": "Unable to copy" });
  };

  copyText() {
    // set textarea to display block, then select the text inside the textarea
    let text = document.getElementById("consoleScript");
    text.style.display = "block";
    text.select();
    // copy the text in the textarea
    try {
      let status = document.execCommand("Copy");
      if (!status) {
        console.log("Cannot copy text");
      } else {
        console.log("Copied");
      }
    } catch (err) {
      console.log("Cannot copy text");
    }
    text.style.display = "none";
  }

  getRewardToRisk(that) {
    let value =
      Math.abs(
        (that.state.entryPrice - that.state.targetPrice) / that.state.entryPrice
      ) /
      Math.abs(
        (that.state.entryPrice - that.state.stopLoss) / that.state.entryPrice
      );
    if (!Number.isNaN(value) && value !== undefined)
      that.setState({
        rewardToRisk: value.toFixed(2),
        tradeStatus: value < 1 ? "short": ""
      });
  }
  getRiskInDollars(that) {
    let value =
      this.getPercentageValue(that.state.maxLoss) * that.state.accountSize;
    if (!Number.isNaN(value) && value !== undefined)
      that.setState({
        riskInDollars: value,
      });
  }
  getProfitAndLoss(that) {
    let value =
      Math.abs(
        (that.state.entryPrice - that.state.targetPrice) / that.state.entryPrice
      ) * that.state.contracts;
      let positionMode =
        this.state.entryPrice < this.state.targetPrice ? "long" : "short";
    if (!Number.isNaN(value) && value !== undefined)
      that.setState({
        profitAndLoss: value.toFixed(4),
        positionMode: positionMode,
      });
  }
  getLeverage(that) {
    let entryPrice = that.state.entryPrice;
    let targetPrice = that.state.targetPrice;
    let stopLoss = that.state.stopLoss;
    let onePercentOfStopLoss = stopLoss / 100;
    let value = 0;
    if (entryPrice < targetPrice) {
      // Long
      value =
        (stopLoss - onePercentOfStopLoss) /
        (entryPrice - (stopLoss - onePercentOfStopLoss * 0.99));
    } else {
      value =
        (stopLoss+onePercentOfStopLoss)/(((stopLoss+onePercentOfStopLoss)*1.01)-entryPrice)
    }
    if (!Number.isNaN(value) && value !== undefined)
      that.setState({
        leverage: Math.abs(Math.trunc(value)),
      });
  }
  getContracts(that, callback) {
    let value =
      (that.state.accountSize * this.getPercentageValue(that.state.maxLoss)) /
      ((that.state.entryPrice - that.state.stopLoss) / that.state.entryPrice);
    if (!Number.isNaN(value) && value !== undefined)
      that.setState(
        {
          contracts: Math.abs(value.toFixed(4)),
        },
        () => {
          callback();
        }
      );
  }
  getUnits(that) {
    let value = that.state.contracts / that.state.entryPrice;
    if (!Number.isNaN(value) && value !== undefined)
      that.setState({
        units: value.toFixed(5),
        positionMode: value < 0.001 ? "short" : "",
      });
  }
  doCalculations(that) {
    this.getContracts(that, () => {
      this.getUnits(that);
      this.getProfitAndLoss(that);
    });
    this.getRewardToRisk(that);
    this.getRiskInDollars(that);
    this.getLeverage(that);
  }

  getPercentageValue(value) {
    return value / 100;
  }

  render() {
    return (
      <div>
        <h3>Calculator</h3>
        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label>Account Size</label>
              <input
                type="number"
                step=".01"
                className="form-control"
                placeholder="Enter Account Size"
                onChange={(evt) => this.handleChange("accountSize", evt)}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Reward:Risk</label>
              <input
                type="text"
                className={`form-control ${this.state.tradeStatus}`}
                disabled
                value={this.state.rewardToRisk}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label>Max Loss %</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter Max Loss %"
                step=".01"
                onChange={(evt) => this.handleChange("maxLoss", evt)}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Risk in $</label>
              <input
                type="text"
                className="form-control"
                disabled
                value={this.state.riskInDollars}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label>Entry Price</label>
              <input
                type="number"
                step=".0000000001"
                className="form-control"
                placeholder="Enter Entry Price"
                onChange={(evt) => this.handleChange("entryPrice", evt)}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Profit And Loss</label>
              <input
                type="number"
                className={`form-control ${this.state.positionMode}`}
                disabled
                value={this.state.profitAndLoss}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label>Target Price</label>
              <input
                type="number"
                step=".0000000001"
                className="form-control"
                placeholder="Enter Target Price"
                onChange={(evt) => this.handleChange("targetPrice", evt)}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Leverage</label>
              <input
                type="text"
                className="form-control"
                disabled
                value={this.state.leverage}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label>Stop Loss Price</label>
              <input
                type="number"
                step=".0000000001"
                className="form-control"
                placeholder="Enter Stop Loss Price"
                onChange={(evt) => this.handleChange("stopLoss", evt)}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Contracts</label>
              <input
                type="text"
                className="form-control"
                disabled
                value={this.state.contracts}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <textarea
                readOnly="readonly"
                className="form-control"
                id="consoleScript"
                ref={(textarea) => (this.textArea = textarea)}
              ></textarea>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>Units</label>
              <input
                disabled
                type="text"
                className={`form-control ${this.state.positionMode}`}
                value={this.state.units}
              />
            </div>
          </div>
        </div>
        <button
          className="btn btn-dark btn-lg btn-block"
          onClick={() => this.copyToClipboard()}
        >
          Copy Code
        </button>
        <p>{this.state.copySuccess}</p>
      </div>
    );
  }
}
