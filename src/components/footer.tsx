import * as React from "react";

export default () => (
    <footer className="w-full py-4 px-2 bg-gray-100 flex flex-col items-center">
        <div className="">
            <span>Built by</span>
            <a className="ml-1 hover:underline font-semibold" href="https://www.oleksiipopov.com">Oleksii Popov</a>
        </div>
        <div className="">
            {new Date().getFullYear()}
        </div>
    </footer>
);
