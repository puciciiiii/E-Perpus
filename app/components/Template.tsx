
import 'material-icons/iconfont/material-icons.css';
import '../../public/css/style.css'
import Header from './Header';
import Menu from './Menu';
import ScriptJs from './ScriptJs';

function Template({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div id="preloader">
                <div className="dz-ripple">
                    <div />
                    <div />
                </div>
            </div>

            <div id="main">

                <Header />
                <div className="container-fluid page-body-wrapper">
                <Menu />

                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="content-body">
                            <div className="container-fluid">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
                </div>

            </div>

            <ScriptJs />

        </div>
    )
}

export default Template