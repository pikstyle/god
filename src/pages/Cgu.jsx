import styles from './Cgu.module.css'

function Cgu() {
    return (
        <div className={styles.div}>
            <h1>Terms of Use</h1>
            <div className={styles.content}>
                <h3>1. Purpose</h3>
                <p>These Terms of Use govern the use of gameofdemocracy.org (the "Website"), a free online game operated by Mounier Simon (the "Publisher"). By using the Website, you fully and unconditionally agree to these Terms.</p>

                <h3>2. Description of the Service</h3>
                <p>
                    GOD is a voting game. Registered users may create a "party" (name, description, and logo), vote for a party (limited to one vote per account), and participate in recurring cycles consisting of an election phase followed by a ruling phase.
                    During the ruling phase, the creator of the winning party ("the Leader") may freely modify the content of the Website's public homepage (including text, images, and links) for the duration of their term.
                    Users may end a ruling phase through a "revolution" mechanism, triggered when a petition reaches the required number of signatures.
                    The Publisher may modify, suspend, or discontinue the game, its rules, or its parameters (including durations and thresholds) at any time, without prior notice or compensation.
                </p>

                <h3>3. Accounts</h3>
                <p>
                    Registration requires a valid email address or a Google account. Users agree to:
                    create only one account; creating multiple accounts to manipulate votes is prohibited and may result in the deletion of the accounts involved;
                    not impersonate another person;
                    keep their login credentials confidential.
                </p>

                <h3>4. User-Generated Content</h3>
                <p>
                    Content published on the Website—including party names and descriptions, logos, avatars, homepage content, and announcements—is created and published solely under the responsibility of its authors. Such content does not reflect the views or opinions of the Publisher.

                    By publishing content, users represent that they own or have the necessary rights to it (including image rights) and agree to indemnify the Publisher against any third-party claims arising from such content.

                    The Publisher does not review or moderate user-generated content before it is published.
                </p>

                <h3>5. Reporting and Removal</h3>
                <p>
                    Any content may be reported by email at pro.pikstyle@mail.com. Reports should include the URL or location of the content and the reason for the report.

                    Upon receiving a report, the Publisher will review the content and, where appropriate, remove any manifestly unlawful content within a reasonable timeframe.

                    The Publisher may also suspend or delete an account for violations of these Terms.
                </p>

                <h3>6. Liability</h3>
                <p>
                    The Website is provided "as is," without any guarantee of availability or uninterrupted service. The game relies on third-party services and automated processes that may experience interruptions.

                    The Publisher shall not be held liable for content published by users or for any damages resulting from the use of the Website.
                </p>

                <h3>7. Changes to the Terms</h3>
                <p>
                    The Publisher may modify these Terms at any time. The version applicable is the one published on the Website on the date of use.
                </p>

                <h3>8. Contact</h3>
                <p>pro.pikstyle@gmail.com</p>
            </div>
        </div>
    )
}

export default Cgu
