import { Button } from "../ui/button";
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-16 relative">
      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-secondary/5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Share Your Experience?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Help others by sharing your interview journey or posting job opportunities you know about.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/blog/add">
              <Button size="lg">Share Interview Experience</Button>
            </Link>
            <Link to="/submit?type=opportunity">
              <Button size="lg" variant="outline">Post a Job Opportunity</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
