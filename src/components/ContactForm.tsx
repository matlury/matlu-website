import React from "react"

const ContactForm = () => (
  <section>
    <h2>Yhteydenottolomake</h2>
    <form action="contact.php" method="POST">
      <div>
        <label htmlFor="email">Sähköpostiosoite</label>
        <br />
        <input
          type="email"
          name="email"
          id="email"
          size={80}
          placeholder="example@email.com"
        />
      </div>
      <div>
        <label htmlFor="contactmsg">Viesti</label>
        <br />
        <textarea id="contactmsg" cols={80} rows={20} />
      </div>
      <div>
        <input type="submit" value="Lähetä" />
      </div>
    </form>
  </section>
)

export default ContactForm
