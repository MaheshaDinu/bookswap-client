import icon from "../../../assets/react.svg"
export function Footer() {
    return (
        <footer className="footer bg-slate-900 text-white text-center p-2 text-sm">
            <div className="footer">
                <p className="copyright">Copyright © 2025</p>
                <p className="business-name">BookSwap Hub</p>
                <img className="icon" src={icon} alt=""/>
            </div>
        </footer>
    );
}