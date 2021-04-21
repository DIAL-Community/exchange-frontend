import { useEffect } from 'react';

export default function DiscourseForum() {
  const apiKey = process.env.NEXT_PUBLIC_DISCOURSE_KEY
  useEffect(() => {
    window.DiscourseEmbed = {
      discourseUrl: 'https://discourse.dial.community/',
      topicId: 14,
    };

    const d = document.createElement('script');
    d.type = 'text/javascript';
    d.async = true;
    d.src = window.DiscourseEmbed.discourseUrl + 'javascripts/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(d);
  }, []);

  return (
    <div>
      <div id="discourse-comments"></div>
    </div>
  );
}