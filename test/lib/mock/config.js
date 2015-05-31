module.exports = function(data)
{
  return {
    _data: data || {},
    set: function(name, val)
    {
      this._data[name] = val;
      return this;
    },
    get: function(name)
    {
      if (name in this._data)
      {
        return this._data[name];
      }
      
      return null;
    }
  };
};
