import React from 'react'
import { shallow } from 'enzyme'
import { PDFViewer } from '../index'

const props = {
  document: {
    content: {}
  },
  allowSelection: false,
  annotations: [],
  saveAnnotation: jest.fn(),
  showAnnoModeAlert: true,
  onHideAnnoModeAlert: jest.fn()
}

describe('PDFViewer component', () => {
  test('should render correctly', () => {
    expect(shallow(<PDFViewer {...props} />)).toMatchSnapshot()
  })
  
  describe('handling annotation mode alert', () => {
    describe('when show anno mode alert is true', () => {
      test('should display an alert when handleAnnoModeAlert is called', () => {
        const wrapper = shallow(<PDFViewer {...props} />)
        wrapper.instance().handleAnnoModeAlert()
        wrapper.update()
        expect(wrapper.find('Alert').at(1).prop('open')).toEqual(true)
      })
      
      test('should call props.hideAnnoModeAlert if user checked don\'t show again box', () => {
        const wrapper = shallow(<PDFViewer {...props} />)
        const spy = jest.spyOn(props, 'onHideAnnoModeAlert')
        wrapper.setState({ annoModeAlert: { open: true, dontShowAgain: true }})
        wrapper.instance().dismissAnnoAlert()
        wrapper.update()
        expect(spy).toHaveBeenCalled()
        spy.mockClear()
      })
  
      test('should not call props.hideAnnoModeAlert if user did not check don\'t show again box', async () => {
        const wrapper = shallow(<PDFViewer {...props} />)
        const spy = jest.spyOn(props, 'onHideAnnoModeAlert')
        await wrapper.setState({ annoModeAlert: { open: true, dontShowAgain: false }})
        wrapper.instance().dismissAnnoAlert()
        expect(spy).not.toHaveBeenCalled()
        spy.mockClear()
      })
  
      xtest('should hide anno mode alert when user clicks dismiss button', () => {
        const wrapper = shallow(<PDFViewer {...props} />)
        wrapper.setState({ annoModeAlert: { open: true, dontShowAgain: false }})
        wrapper.instance().dismissAnnoAlert()
        wrapper.update()
        console.log(wrapper.find('Alert').at(1).childAt(0).dive().simulate('click'))
      })
    })
  
    describe('when show anno mode alert is false', () => {
      test('should not display an alert when handleAnnoModeAlert is called', () => {
        const wrapper = shallow(<PDFViewer {...props} showAnnoModeAlert={false} />)
        wrapper.instance().handleAnnoModeAlert()
        wrapper.update()
        expect(wrapper.find('Alert').at(1).prop('open')).toEqual(false)
      })
    })
  })
})
