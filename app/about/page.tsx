import Container from "@/components/global/Container";

function AboutPage() {
  return (
    <Container>
      <section>
        <h1 className="flex flex-wrap gap-2 sm:gap-x-6 items-center justify-center text-4xl font-bold leading-none tracking-wide sm:text-6xl text-primary">
          We love
          <span className="bg-primary py-2 px-4 rounded-lg tracking-widest text-white">
            wine
          </span>
        </h1>
        <p className="mt-6 text-lg tracking-wide leading-8 max-w-2xl mx-auto text-primary">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero hic
          distinctio ducimus temporibus nobis autem laboriosam repellat, magni
          fugiat minima excepturi neque, tenetur possimus nihil atque! Culpa
          nulla labore nam?
        </p>
      </section>
    </Container>
  );
}

export default AboutPage;
