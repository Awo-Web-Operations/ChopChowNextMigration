import styles from '../../../src/components/Checkout/style.module.css'

const Subscription = ({data, setData, handleChange}) => {
    
    
  return (
    <div className={styles.box_subscription}>
        <div>
            <label>
                <input type='radio' name='subscription' value="subscribe" checked={data.subscription === "subscribe"} onChange={handleChange}/>
                <p>Subscribe and save (5%)</p>
            </label>
            <label>
                <input type='radio' name='subscription' value="one_time" checked={data.subscription === "one_time"} onChange={handleChange}/>
                <p>One- Time Purchase</p>
            </label>
        </div>
        <div>
            <label>Deliver Every </label>
            <select name="dateOfDelivery" value={data.dateOfDelivery} onChange={handleChange}>
                <option value="1 week">1 week <i>(most common)</i></option>
                <option value="2 week">2 weeks </option>
                <option value="3 week">3 weeks </option>
            </select>
        </div>
    </div>
  )
}

export default Subscription