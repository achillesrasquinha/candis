import React from 'react'
import { shallow } from 'enzyme'

import MenuBar from '../../component/widget/MenuBar'

let menus, onClick, ID, classNames, wrapper

beforeEach(() => {
    ID = 'axyu'
    classNames = {root: 'menu-class'}
    onClick = jest.fn()
    menus = ['wvhwhe', 'dfvsv']
    wrapper = shallow(<MenuBar menus={menus} ID={ID} onClick={onClick} classNames={classNames}/>)
})

test('should render MenuBar correctly', () => {
    expect(wrapper).toMatchSnapshot()
})
