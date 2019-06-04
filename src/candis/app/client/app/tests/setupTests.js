import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import nprogress from 'nprogress'

configure({ adapter: new Adapter() })
global.nprogress = nprogress
