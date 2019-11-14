import {Config} from '../src'
import {dateNumberToString} from './testUtils'

describe("test utils", () => {
  it ('#dateNumberToString should return properly formatted  date', () => {
    expect(dateNumberToString(0, Config.defaultConfig.dateFormat)).toEqual('12/30/1899')
    expect(dateNumberToString(2, Config.defaultConfig.dateFormat)).toEqual('01/01/1900')
    expect(dateNumberToString(43465, Config.defaultConfig.dateFormat)).toEqual('12/31/2018')
  })
})