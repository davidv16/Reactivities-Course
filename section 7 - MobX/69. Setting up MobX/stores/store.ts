import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store {
  //gets in the activityStore class
  activityStore: ActivityStore
}

//export the activitystore class as a store
export const store: Store = {
  //create a new instance of the class
  activityStore: new ActivityStore()
}

//we then pass in our store to the react context
export const StoreContext = createContext(store);

//a custom react hook that allows use our stores in our components
export function useStore() {
  //also a react hook to use the 
  return useContext(StoreContext)
}