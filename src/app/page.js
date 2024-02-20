import Greet from "./greet";
import styles from "./page.module.css";

export default function Home() {
    return (
        <main className={styles.main}>
            <Greet/>
            <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>
        </main>
    );
}
