import { asset } from '../utils/assets';
export default function Story() {
  return (
    <main className="container story">
      <section className="story-hero">
        <img className="hero-bg" src={asset("/img/blossom-bg.webp")} alt="A courtyard beneath a blossoming tree" />
        <img className="hero-dog" src={asset("/img/dog-toy.webp")} alt="A figure playing with their dog" />
        <div className="cap">
          <b>Familiars Workshop</b>
          <span>makes talismans in the likeness of the animals we love.</span>
        </div>
      </section>

      <section className="story-grid">
        <div className="col">
          <img className="ink mountains" src={asset("/img/mountain-backgrounds.webp")} alt="Five immortal islands drifting on the sea" />
          <h3>But the Workshop is older than us.</h3>
          <p>Long ago, beyond the Eastern Sea, five immortal islands drifted upon the water.</p>
          <p>Two were lost.</p>
          <p>Their people fled to the mortal world,</p>
          <p>carrying with them the old ways of working precious metal.</p>
          <img className="ink boat" src={asset("/img/boat-man.webp")} alt="An island and a boat crossing to the mortal world" />
        </div>
        <div className="col">
          <img className="ink tiger" src={asset("/img/tiger-tree.webp")} alt="Tiger sleeping beneath a great peach tree" />
          <h3>On Penglai, one island that remained,</h3>
          <p>a guardian named Tiger kept watch beneath a great peach tree.</p>
          <p>Until he fell asleep.</p>
          <p>While he slept, the animals kept watch in his place.</p>
        </div>
      </section>

      <section className="story-card">
        <img className="bg" src={asset("/img/horse-bg.webp")} alt="A figure with horses in a field" />
        <div className="top">
          <p className="small">When Tiger woke, he was given a new charge:</p>
          <p className="medium">to guard the bond between people and the creatures who had stayed beside them.</p>
          <p className="small">He found the descendants of the lost islands and placed the work in their hands.</p>
        </div>
        <div className="bot">
          That is how the Workshop began.<br />
          The hands do the making.<br />
          Tiger keeps watch.<br />
          Mostly.
        </div>
      </section>
    </main>
  );
}
