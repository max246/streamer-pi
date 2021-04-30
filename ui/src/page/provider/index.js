import ListProvider from "../../component/list_provider";
import EditProvider from "../../component/edit_provider";
import { Link } from "react-router-dom";

function Provider(props) {
  let elm;
  if (props.do === "edit") elm = <EditProvider type="edit"></EditProvider>;
  else elm = <ListProvider></ListProvider>;
  return (
    <>
      <Link to="/instagram" className="navigationLink">
        Instagram
      </Link>

      {elm}
    </>
  );
}

export default Provider;
