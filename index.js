// First reducer
const countReducer = (state = {count : 0} ,action) => {
    console.log('countReducer' ,action)
    switch(action.type){
        case 'INCRIMENT':
            return {...state, count : state.count + 1};
        case 'DECREMENT':
            return {...state, count : state.count - 1};
        default :
            return state;
    }
}
// Second reducer
const toDoReducer = (state = {toDos : ['My todo one for monday.','My todo two for tuesday.']}, action) =>{
    console.log('toDoReducer' ,action)
    switch(action.type){
        case 'ADD' :
            return{
                ...state,
                toDos : [...state.toDos, action.ToDo]
            }
        case 'DELETE' :
            return{
                ...state,
                toDos : state.toDos.filter(td => td !== action.ToDo)
            }
        default:
            return state;
    }
}

// createStore method Implementation from scratch, this will take REDUCER or COMBINEREDUCER as argument.
const createStore = (reducers) =>{
    let state;  // initial state must be undefined
    let listeners = [];  // list of the subscribers, actually this will be a list of callback methods which will be called on Dispatch of every Action. 

    const Dispatch = (action)=>{   // Disatch method will pass current STATE and triggered Action to Reducers, and finaly current state will be updated with newly returned state.
        state = reducers(state,action);
        listeners.forEach(lis => lis());  // after mutating the state, just invoke the callBack of every Subscribers.
    }

    const GetState = () =>{ // GetState method will return the current updated STATE
        return state;
    }

    const SubscribeToStore = (myListener)=>{  // SubscribeToStore witt kake a reference to callBack method which will be called when ever our state is changed.  Also it will return a function which will be used to UnSubscribe from our STORE.
        listeners.push(myListener);
        return () => listeners.filter(listener => listener != myListener);
    }


    Dispatch({type : 'INITIALIZE'});  // Initialy our state will be undefined So you must call this to initialize all of your STATE first time. "INITIALIZE" may be replaced with any string or even an empty string. or you can just call Dispatch with empty Object Dispatch({});


    return { // Return all the 3 methods you can also use this syntax "return {Dispatch, GetState, SubscribeToStore}"
        Dispatch : Dispatch,
        GetState : GetState,
        SubscribeToStore : SubscribeToStore
    }
} 

// This is the implimentation of "combineReducer" method from scratch, it will take an object as argument which will have "key" of "reducerName" and "value" of "rferance to reducer function"
// this will return an function which will take 2 arguments "MAIN STATE" and "CURRENTLY TRIGGERED ACTION", this returned function will be invoked in "DISPATCH" method of "createStore"
// returned function will loop through all the "Reducers" (passed as argument to combineReducer as object { k : v }), and invoke them one by one to mutate the STATE by passing the "MAIN STATE" and "CURRENTLY TRIGGERED ACTION", if action.type matches to any of the reducer then our state will be mutated accordingly.
const combineReducer = (Reducers) =>{ //"combineReducer" it will take an object as argument which will have "key" of "reducerName" and "value" of "rferance to reducer function"
    return (state = {}, action) =>{ // it will return this function and it will be invoked in "DISPATCH" method of "createStore"
        const NextState = Object.keys(Reducers).reduce((acc, reducerKey) =>{ // loop through all the reducers passed as argument to combineReducer as object { k : v }
            acc[reducerKey] = Reducers[reducerKey](state[reducerKey],action); // store the returned "MUTATED STATE" in {} empty Object.
            return acc; // UPDATE the ACCUMULATOR
        }, {});
        return NextState; // FINALY this "NEW STATE" will returned after passing "action" to all the available reducers.
    }
}

// call "combineReducer" to combine all the reducers and reduce them to a single STATE OBJECT by combining all individual states into as single STATE OBJECT.
const rootReducer = combineReducer({
    countReducer : countReducer,
    toDoReducer : toDoReducer
});


const store = createStore(rootReducer); // invoke "createStore" by passing the "rootReducer"
const UnSubscribe = store.SubscribeToStore(updateDOM); // call SubscribeToStore to get the regular updates, and ass the CallBack method to update the DOM.
console.log(store.GetState())  // Print initial state to console




// UI Elements

function updateDOM(){
    document.getElementById("count-value").innerHTML = store.GetState().countReducer.count;  // render counter

    var toDoList_from_state = store.GetState().toDoReducer.toDos;
    var toDoList = '<table border="1">'
    toDoList_from_state.forEach(function(todo) {
        toDoList += '<tr><td>'+ todo + '</td><td> <button class="remove" id="' +  todo  + '">Delete</button></td></tr>';
    }); 
    toDoList += '</table>';

    document.getElementById("toDoContainer").innerHTML = toDoList;

    var buttons = document.getElementsByClassName('remove');
    for (var i=0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', remove);
    };
}


updateDOM()

function incriment(){
    store.Dispatch({type : 'INCRIMENT'});
}

function decrement(){
    store.Dispatch({type : 'DECREMENT'});
}


function addToDo(){
    var newToDo = document.getElementById('todo-input').value;
    store.Dispatch({type : 'ADD', ToDo : newToDo})
}

function remove(){
    var id = this.getAttribute('id');
    store.Dispatch({type : 'DELETE', ToDo : id})
}




