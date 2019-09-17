import { GraphQLSchema, GraphQLField, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLArgument } from 'graphql';
import Container from 'typedi';
export function SDLTests(suiteName: string) {


  let schema: GraphQLSchema;

  describe(`SDL`, () => {

    beforeAll(() => {
      schema = Container.get('schema');
    })

    describe('RelayedConnection', () => {

    })

    describe('RelayedQuery', () => {
      describe('Types', () => {
        it('Should have a getAllUsersPaginated with autogenerated connection/edge', () => {
          const query = schema.getQueryType();
          const field: GraphQLField<any, any, any> = query!.getFields()['getAllUsersPaginated'];
  
          expect(field.type.toString()).toEqual('getAllUsersPaginatedConnection!');
          const connection = schema.getType('getAllUsersPaginatedConnection')!.toConfig() as GraphQLObjectTypeConfig<any, any, any>;
          const edge = schema.getType('getAllUsersPaginatedEdge')!.toConfig() as GraphQLObjectTypeConfig<any, any, any>;
  
          expect(connection).toBeTruthy();
          expect(edge).toBeTruthy();
        })
      })

      describe('Arguments', () => {

        it('Should keep user-defined arguments', () => {
          const query = schema.getQueryType();
          const field: GraphQLField<any, any, any> = query!.getFields()['getAllUsersPaginated'];
  
          expect(field.args.length).toBeGreaterThan(0)
        })
  
        it('Should add inline relay arguments', () => {
          const query = schema.getQueryType();
          const field: GraphQLField<any, any, {}> = query!.getFields()['getAllUsersPaginated'];
  
          const first = field.args.find((a) => a.name === 'first');
          const last = field.args.find((a) => a.name === 'last');
          const before = field.args.find((a) => a.name === 'before');
          const after = field.args.find((a) => a.name === 'after');
  
          const checkArg = (expectedType: string, arg?: GraphQLArgument) => {
            expect(arg).toBeTruthy();
            expect(arg!.type.toString()).toEqual(expectedType);
          }
  
          checkArg('Int', first)
          checkArg('Int', last)
          checkArg('String', before)
          checkArg('String', after)
        })


        it('Should add InputType relay arguments with default \'pagination\' key', () => {
          const query = schema.getQueryType();
          const expectedType = schema.getType('ConnectionArgs') as GraphQLObjectType;
          const fields: GraphQLField<any, any, {}> = query!.getFields()['testInputTypeArgs'];

          const namedArg = fields.args.find((f) => f.name === "pagination");

          expect(expectedType).toBeTruthy()
          expect(namedArg).toBeTruthy()
          expect(namedArg!.type).toBe(expectedType)
        })

        it('Should add InputType relay arguments with supplied key', () => {
          const query = schema.getQueryType();
          const expectedType = schema.getType('ConnectionArgs') as GraphQLObjectType;
          const fields: GraphQLField<any, any, {}> = query!.getFields()['testNamedInputTypeArgs'];

          const namedArg = fields.args.find((f) => f.name === "testName");

          expect(expectedType).toBeTruthy()
          expect(namedArg).toBeTruthy()
          expect(namedArg!.type).toBe(expectedType)
        })



      })


    })

  })
}