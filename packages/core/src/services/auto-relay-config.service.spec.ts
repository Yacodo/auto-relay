import { AutoRelayConfig } from './auto-relay-config.service'
import { Container } from 'typedi'
import { ORMConnection } from '../orm';

class ORMMock extends ORMConnection {
  public autoRelayFactory(field: any, self: any, type: any, through?: any) {
    return (): any => { };
  }
}

describe('AutoRelayConfig', () => {

  let typeRelayConfig: AutoRelayConfig | null = null
  beforeEach(() => {
    typeRelayConfig = null;
  })

  it('Should not instantiate without config', () => {
    expect(() => new (AutoRelayConfig as new () => any)()).toThrow(/No config/);
  })

  it('Should not instantiate without orm', () => {
    expect(() => new AutoRelayConfig({ orm: undefined as any })).toThrow(/config\.orm must be a function/);
  })

  it('Should instantiate with basic config', () => {
    const autoRelay = new AutoRelayConfig({orm: () => ORMMock})
    expect(autoRelay).toBeTruthy();
  })

  it('Should provide ORM_CONNECTION', () => {
    const autoRelay = new AutoRelayConfig({orm: () => ORMMock})

    const test: () => typeof ORMConnection = Container.get('ORM_CONNECTION');

    expect(test()).toBe(ORMMock);
  })

  it('Should make available supplied PAGINATION_OBJECT and CONNECTIONARGS_OBJECT', () => {
    const pagination = () => class TestA { };
    const connectionArgs = () => class TestB { };

    typeRelayConfig = new AutoRelayConfig({
      orm: () => ORMMock, objects: {
        connectionArgs,
        pagination
      }
    })


    const containerA: () => typeof Object = Container.get('PAGINATION_OBJECT');
    const containerB: () => typeof Object = Container.get('CONNECTIONARGS_OBJECT');

    expect(containerA().name).toBe(pagination().name);
    expect(containerB().name).toBe(connectionArgs().name);
    expect(containerA().name).toBe('TestA')
    expect(containerB().name).toBe('TestB')
  })

  it('Should generate PAGINATION_OBJECT and CONNECTIONARGS_OBJECT when none are given', () => {
    typeRelayConfig = new AutoRelayConfig({ orm: () => ORMMock });

    const containerA: () => typeof Object = Container.get('PAGINATION_OBJECT');
    const containerB: () => typeof Object = Container.get('CONNECTIONARGS_OBJECT');

    expect(containerA()).toBeTruthy()
    expect(containerB()).toBeTruthy()
  })
})