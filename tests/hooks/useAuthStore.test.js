import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { authSlice } from "../../src/store";
import { initialState, notAuthenticatedState } from "../fixtures/authSlice";
import { testUserCredentials } from "../fixtures/testUser";
import { calendarApi } from '../../src/api';

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: {...initialState}
        }
    });
};

describe('Pruebas en useAuthStore hook', () => {
    beforeEach(() => localStorage.clear());

    test('Debe de regresar los valores por defecto', () => {
        const mockStore = getMockStore({...initialState}); 
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore} >{children}</Provider>
        });
        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function),
        });
    });

    test('startLogin debe de realizar el login correctamente', async() => {
        const mockStore = getMockStore({...notAuthenticatedState}); 
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore} >{children}</Provider>
        });
        await act( async() => {
            await result.current.startLogin(testUserCredentials);
        });

        const { errorMessage, status, user } = result.current;
        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test', uid: '63ed16c4b9830def2ccf7c4a' }
        });
        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));
    });

    test('StarLogin debe de fallar la autenticacion al hacer login', async() => {
        const mockStore = getMockStore({...notAuthenticatedState}); 
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore} >{children}</Provider>
        });
        await act( async() => {
            await result.current.startLogin({email:'algo@google.com', password:'134235345'});
        });
        const { errorMessage, status, user } = result.current;
        expect(localStorage.getItem('token')).toBe(null);
        expect({errorMessage, status, user}).toEqual({
            errorMessage: 'Credenciales incorrectas',
            status: 'not-authenticated',
            user: {}
        });

        await waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        )
    });

    // test('starregister debe de crear un usuario', async() => {
    //     const newUser = { email:'algo@google.com', password:'134235345', name:'Test User2' }
    //     const mockStore = getMockStore({...notAuthenticatedState}); 
    //     const { result } = renderHook(() => useAuthStore(), {
    //         wrapper: ({children}) => <Provider store={mockStore} >{children}</Provider>
    //     });
    //     const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
    //         ok: true,
    //         uid: '123455321',
    //         name: 'Test User',
    //         token: 'ALGUN_TOKEN'
    //     })
    //     await act( async() => {
    //         await result.current.startRegister(newUser);
    //     });
    //     expect({errorMessage, status, user}).toEqual({
    //         errorMessage: undefined,
    //         status: 'authenticated',
    //         user: { name: 'Test User', uid: '123455321'}
    //     });

    //     spy.mockRestore();
    // })

    // test('startRegister debe de crear un usuario', async() => {
        
    //     const newUser = { email: 'algo@google.com', password: '123456789', name: 'Test User 2' };

    //     const mockStore = getMockStore({ ...notAuthenticatedState });
    //     const { result } = renderHook( () => useAuthStore(), {
    //         wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
    //     });

    //     const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
    //         data: {
    //             ok: true,
    //             uid: '1263781293',
    //             name: 'Test User',
    //             token: 'ALGUN-TOKEN'
    //         }
    //     });

    //     await act(async() => {
    //         await result.current.startRegister(newUser)
    //     });

    //     const { errorMessage, status, user } = result.current;

    //     expect({ errorMessage, status, user }).toEqual({
    //         errorMessage: undefined,
    //         status: 'authenticated',
    //         user: { name: 'Test User', uid: '1263781293' }
    //     });

    //     spy.mockRestore();

    // });

    test('startRegister debe de fallar la creación', async() => {
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.startRegister(testUserCredentials)
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Un usuario existe con ese correo',
            status: 'not-authenticated',
            user: {}
        });
    });


    test('checkAuthToken debe de fallar si no hay token', async() => {
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.checkAuthToken()
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });

    });

    // test('checkAuthToken debe de autenticar el usuario si hay un token', async() => {
        
    //     const { data } = await calendarApi.post('/auth', testUserCredentials );
    //     console.log(data)
    //     localStorage.setItem('token', data.token );

    //     const mockStore = getMockStore({ ...initialState });
    //     const { result } = renderHook( () => useAuthStore(), {
    //         wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
    //     });

    //     await act(async() => {
    //         await result.current.checkAuthToken()
    //     });

    //     const { errorMessage, status, user } = result.current;
    //     console.log(errorMessage, status, user)
    //     expect({ errorMessage, status, user }).toEqual({
    //         errorMessage: undefined,
    //         status: 'authenticated',
    //         user: { name: 'Test User', uid: '62a10a4954e8230e568a49ab' }
    //     });

    // });

    
})