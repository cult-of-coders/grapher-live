import React from 'react';
import classNames from 'classnames';

export default class Window extends React.Component {
    static defaultProps = {
        opened: false,
    };

    constructor(props) {
        super();
        this.state = {opened: props.opened}
    }

    render() {
        return (
            <div className={classNames('windower', this.state.opened ? 'shown' : null)}>
                <div className="header" onClick={this.toggleState.bind(this)}>{this.props.header}</div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        );
    }

    toggleState() {
        this.setState({
            opened: !this.state.opened
        })
    }
}