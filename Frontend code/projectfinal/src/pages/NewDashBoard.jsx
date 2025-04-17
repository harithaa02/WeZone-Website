import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

function NewDashBoard(){
    return(
        <div>
            <div className="row">
                <div className="col-2">
                    <Sidebar />
                </div>
                <div className="col-10">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default NewDashBoard;