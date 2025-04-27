import styles from '../../public/css/loader.module.css';

// default page for between-page navigation loading
export default function Loading() {
  return (
    <div className={styles.overlayContainer}>
      <div className={styles.loadingSpinner}>
      </div>
    </div>
  );
}