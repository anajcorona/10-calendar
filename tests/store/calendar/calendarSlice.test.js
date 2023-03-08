import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";

describe('Pruebas en CalendarSlice', () => {

    test('Debe de regresar el estado por defecto', () => {
        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState);
    });

    test('onSetActiveEvent debe de avticar evento', () => {
        const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]));
        expect(state.activeEvent).toEqual(events[0]);
    });

    test('onAddNewEvent debe de agregar el evento', () => {
        const newEvent = {
            id: '3', 
            start: new Date('2022-10-24 13:00:00'),
            end: new Date('2022-10-24 15:00:00'),
            title: 'Cumpleaños de Ana',
            notes: 'Hay que comprar el pastel',
        };
        const state = calendarSlice.reducer(calendarWithEventsState, onAddNewEvent(newEvent));
        expect(state.events).toEqual([...events, newEvent]);
    });

    test('onUpdatedEvent debe de actualizar el evento', () => {
        const updatedEvent = {
            id: '1', 
            start: new Date('2022-10-24 13:00:00'),
            end: new Date('2022-10-24 15:00:00'),
            title: 'Cumpleaños del Jefe',
            notes: 'Hay que comprar el pastel y gelatina',
        };
        const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(updatedEvent));
        expect(state.events).toContain(updatedEvent);
    });

    test('onDeleteEvent debe de borrar el evento activo', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent(events[0]));
        expect(state.activeEvent).toEqual(null);
        expect(state.events).not.toContain(events[0]);
    });

    test('onLoadEvents debe de establecer los eventos', () => {
        const state = calendarSlice.reducer(initialState, onLoadEvents(events));
        expect(state.isLoadingEvents).toBeFalsy();
        expect(state.events).toEqual(events);

        const newState = calendarSlice.reducer(state, onLoadEvents(events));
        expect(state.events.length).toBe(events.length);

    });

    test('onLogoutCalendar debe de limpiar el estado', () => {
        const stateLogout = calendarSlice.reducer(calendarWithActiveEventState, onLogoutCalendar());
        expect(stateLogout).toEqual(initialState);
    });

});