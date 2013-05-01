# Keentivate
An _almost_ no-code Keen.js to HTML Wrapper

## Why?
Keen's javascript SDK is unfortunately complex.  Quite powerful, but unfortunately complex.  Keentivate wraps all that complexity up and turns it into a simple HTML markup syntax.  Ideally, you shouldn't have to write more than two lines of javascript!

## Install
You only need to include the `keentivate.min.js` javascript file, setup your API keys, and you're ready to rock-and-roll!

```
<script type="text/javascript" src="/js/keentivate.min.js"></script>
<script type="text/javascript">
  var keenCharts = new keentivate("50f9e03d38433113c1000000", "1c6b79aedef24363ba84f6790e81c4de", {
    keenClass: "keentivate"
  })
</script>
```

## HTML Syntax

You can see all of the examples on the [keentivate homepage](http://cultivatestudios.github.io/keentivate/)

In general, though, you're going to want to work with `div`s, and add a keentivate-specific class.  I usually just use `keentivate`.  You'll then apply `keen-` attributes to specify the settings for that visualization.  Below is an example of a simple pie chart.

```
 <div class="keentivate"
   keen-type="pie"
   keen-event="Plays"
   keen-group="play_type"
   keen-title="Types of Plays">
</div>
```

# Todo

I just want to make a *GIANT* note that keentivate is not thoroughly tested.  I've tested it as far as my uses go, and it works fine, but I won't in any way promise that it won't blow up in your environment.

- Test
- Support all label/metric options.  I've only added options as I've needed them, so there isn't 100% coverage on Keen's options.
- Multiline Chart Support
- Documentation on differing syntax between Keen.js and keentivate
- Documentation in general

# Who?
Keentivate was built by [Joe Wegner](http://www.wegnerdesign.com) under the umbrella of [Cultivate Studios](http://www.cultivatestudios.com)

# License

Keentivate is licensed under the [MIT License](http://opensource.org/licenses/MIT)