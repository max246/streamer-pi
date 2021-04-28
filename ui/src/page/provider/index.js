import ListProvider from "../../component/list_provider";
import EditProvider from "../../component/edit_provider";

function Provider(props) {
  let elm;
  if (props.do === "edit") elm = <EditProvider type="edit"></EditProvider>;
  else elm = <ListProvider></ListProvider>;
  return <>{elm}</>;
}

export default Provider;
