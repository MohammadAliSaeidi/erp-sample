import { Component } from "react";

export type MyClassComponentProps = {
	initialCounter: number;
};

export class MyClassComponent extends Component {
	state: {
		counter: number;
	};

	constructor(props: MyClassComponentProps) {
		super(props);

		this.state = {
			counter: 0,
		};

		this.handleAddCounter = this.handleAddCounter.bind(this);
	}

	handleAddCounter = () => {
		this.setState({
			counter: this.state.counter + 1,
		});
	};

	render() {
		return (
			<div>
				<h1>My Class Component</h1>
				<button onClick={() => this.handleAddCounter()}>
					add count
				</button>
				<p>Count: {this.state.counter}</p>
			</div>
		);
	}
}
