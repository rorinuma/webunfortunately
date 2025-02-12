import { FcGoogle } from "react-icons/fc"
import styles from "../../title.module.css"
import { SiApple } from "react-icons/si"

const SocialMediaOptions = () => {
  return (
    <>
      <div>
        <button className={`${styles.optionsBtn} ${styles.google}`}>
          <div className={styles.iconContainer}><FcGoogle className={styles.icon} /></div>
          <div>Sign up with Google</div>
        </button>
      </div>
      <div>
        <button className={`${styles.optionsBtn} ${styles.apple}`}>
          <div className={styles.iconContainer}><SiApple className={styles.icon} /></div>
          <div>Sign up with Apple</div>
        </button>
      </div>
      <div className={styles.br}>
        <div className={styles.brLineContainer}><div className={styles.brLine}></div></div>
        <div className={styles.brText}>or</div>
        <div className={styles.brLineContainer}><div className={styles.brLine}></div></div>
      </div>
    </>
  )
}
export default SocialMediaOptions
