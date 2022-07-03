import { GlobalDialogTypeCompose } from "./typings";

interface IObservableDataSource {
  value: GlobalDialogTypeCompose[];
  subscribe: (
    setter: React.Dispatch<React.SetStateAction<GlobalDialogTypeCompose[]>>
  ) => string;
  unSubscribe: (uuid: string) => void;
  setValue: (value: GlobalDialogTypeCompose[]) => void;
  notifier: {
    [T in string]: (value: GlobalDialogTypeCompose[]) => void;
  };
}


const ObservableDataSource: IObservableDataSource = {
  value: [],
  subscribe(_setter) {
    throw new Error('Function unimpleted');
  },
  unSubscribe(_uuid) {
    throw new Error('Function unimpleted');
  },
  setValue(_value) {
    throw new Error('Function unimpleted');
  },
  notifier: {},
};
ObservableDataSource.subscribe = (setter) => {
  const key = crypto.randomUUID();
  ObservableDataSource.notifier[key] = setter;
  return key;
};
ObservableDataSource.unSubscribe = (uuid) => {
  delete ObservableDataSource.notifier[uuid];
};
ObservableDataSource.setValue = (value) => {
  ObservableDataSource.value = value;
  for (const key in ObservableDataSource.notifier) {
    ObservableDataSource.notifier[key](value);
  }
};


export default ObservableDataSource;