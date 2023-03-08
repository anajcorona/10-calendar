import calendarApi from "../../../src/api/calendarApi";

describe('Calenedar Api tests', () => {
    test('Debe de tener la configuracion por defecto', () => {
        // console.log(calendarApi)
        expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
    });

    // test('Debe de tener el x-token en el header de todas las peticiones', async() => {
    //     localStorage.setItem('token', 'ABC-123-CYZ');
    //     console.log(process.env.VITE_API_URL);
    //     console.log(await calendarApi.get('/auth'));

    // //   const res = await calendarApi.get('/events');
    //     console.log(res);
    // })
});