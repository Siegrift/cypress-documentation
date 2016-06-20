import cs from 'classnames'
import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'

class Dropdown extends Component {
  constructor (props) {
    super(props)

    this.state = { open: false }
  }

  componentDidMount () {
    this.outsideClickHandler = (e) => {
      if (!findDOMNode(this).contains(e.target)) {
        this.setState({ open: false })
      }
    }
    document.body.addEventListener('click', this.outsideClickHandler)

    if (this.props.defaultState === 'open') {
      this._toggleOpen()
    }
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.outsideClickHandler)
  }

  render () {
    return (
      <li className={cs('dropdown', this.props.className, { open: this.state.open })}>
        <a onClick={this._toggleOpen}>
          {this._icon()}{' '}
          {this.props.renderItem(this.props.chosen)}{' '}
          {this._caret()}
        </a>
        {this._items()}
      </li>
    )
  }

  _icon () {
    if (this.props.icon) {
      return (
        <i className={`fa fa-${this.props.icon}`}></i>
      )
    }

  }

  _caret () {
    if (!this.props.others.length) return null

    return (
      <span>
        <span className='dropdown-caret'></span>
        <span className='sr-only'>Toggle Dropdown</span>
      </span>
    )
  }

  _toggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  _items () {
    if (!this.props.others.length) return null

    return (
      <ul className='dropdown-menu'>
        {_.map(this.props.others, (item) => (
          <li
            key={item[this.props.keyProperty]}
            tabIndex='0'
            onClick={() => this._onSelect(item)}
          >{this.props.renderItem(item)}</li>
        ))}
      </ul>
    )
  }

  _onSelect (item) {
    this.setState({ open: false })
    this.props.onSelect(item)
  }
}

Dropdown.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  chosen: PropTypes.object.isRequired,
  others: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  // property for unique value on each item that can be used as its key
  keyProperty: PropTypes.string.isRequired,
  defaultState: PropTypes.string,
}

Dropdown.defaultProps = {
  className: '',
  defaultState: 'closed',
}

export default Dropdown
