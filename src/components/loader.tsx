import styles from "../../public/css/loader.module.css";

export const Loader = (props: any) => {
    return (
      // <div className={inCaseStudy ? styles.loaderCS : styles.loaderCat}>
        <div className={styles.loaderIcon} >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill='none'
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke={props.fill} // fill color
                strokeWidth="4"
                strokeDasharray="113"
                strokeDashoffset="40"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 20 20"
                  to="360 20 20"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>

      // </div>
    );
  }